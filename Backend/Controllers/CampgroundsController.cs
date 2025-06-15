using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampgroundsController : ControllerBase
    {
        private readonly AlbCampDbContext _context;
        private readonly PhotoService _photoService;

        public CampgroundsController(AlbCampDbContext context, PhotoService photoService)
        {
            _context = context;
            _photoService = photoService;
        }

        // GET: api/Campgrounds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Campground>>> GetCampgrounds([FromQuery] string? location = null)
        {
            var query = _context.Campgrounds
                                .Include(c => c.Images)
                                .Include(c => c.Author)
                                .AsQueryable();

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(c => c.Location.Contains(location));
            }

            var campgrounds = await query.ToListAsync();
            return Ok(campgrounds);
        }

        // GET: api/Campgrounds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Campground>> GetCampground(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid ID provided.");

            var campground = await _context.Campgrounds
                                           .Include(c => c.Images)
                                           .Include(c => c.Reviews)
                                           .ThenInclude(r => r.User)
                                           .Include(c => c.Author)
                                           .AsSplitQuery()
                                           .FirstOrDefaultAsync(c => c.CampgroundId == id);

            if (campground == null)
                return NotFound("Cannot find that campground!");

            return Ok(campground);
        }

        // POST: api/Campgrounds
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCampground(
            [FromForm] IFormFile[] images,
            [FromForm] string name,
            [FromForm] string description,
            [FromForm] string location,
            [FromForm] double latitude,
            [FromForm] double longitude,
            [FromForm] int price)
        {
            if (images == null || images.Length == 0)
            {
                return BadRequest(new { errors = new { Images = new[] { "The Images field is required." } } });
            }

            try
            {
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                {
                    return Unauthorized("User is not authenticated.");
                }

                var userId = int.Parse(userIdClaim.Value);
                var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
                if (!userExists)
                {
                    return BadRequest("Invalid UserId. User does not exist.");
                }

                var campground = new Campground
                {
                    Name = name,
                    Location = location,
                    Description = description,
                    Latitude = latitude,
                    Longitude = longitude,
                    Price = price,
                    UserId = userId,
                    Images = new List<Image>()
                };

                foreach (var image in images)
                {
                    var uploadResult = await _photoService.UploadImageAsync(image);
                    if (uploadResult.Error != null)
                    {
                        return BadRequest(new { errors = new { Images = new[] { uploadResult.Error.Message } } });
                    }

                    campground.Images.Add(new Image
                    {
                        Url = uploadResult.SecureUrl.ToString(),
                        Filename = uploadResult.PublicId
                    });
                }

                _context.Campgrounds.Add(campground);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCampground), new { id = campground.CampgroundId }, campground);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCampground(int id, [FromForm] UpdateCampgroundDto updateDto)
        {
            // 🛠️ Remove images from model validation so it's not treated as required
            ModelState.Remove("Images");

            if (!ModelState.IsValid)
            {
                return BadRequest(new { errors = ModelState });
            }

            try
            {
                var userId = int.Parse(User.FindFirst("UserId").Value);

                var campground = await _context.Campgrounds
                                               .Include(c => c.Images)
                                               .FirstOrDefaultAsync(c => c.CampgroundId == id);

                if (campground == null)
                {
                    return NotFound("Campground not found.");
                }

                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (campground.UserId != userId && userRole != "admin")
                {
                    return Forbid("You are not authorized to update this campground.");
                }

                // Update other fields
                campground.Name = updateDto.Name;
                campground.Location = updateDto.Location;
                campground.Description = updateDto.Description;
                campground.Price = updateDto.Price;
                campground.Latitude = updateDto.Latitude;
                campground.Longitude = updateDto.Longitude;


                var existingImagesRaw = Request.Form["existingImages"];
                List<string> existingImages = new();

                if (updateDto.Images != null && updateDto.Images.Count > 0)
                {
                    // Clear all existing images and replace with new ones
                    campground.Images.Clear();

                    foreach (var image in updateDto.Images)
                    {
                        var uploadResult = await _photoService.UploadImageAsync(image);
                        if (uploadResult.Error != null)
                        {
                            return BadRequest(new { errors = new { Images = new[] { uploadResult.Error.Message } } });
                        }

                        campground.Images.Add(new Image
                        {
                            Url = uploadResult.SecureUrl.ToString(),
                            Filename = uploadResult.PublicId
                        });
                    }
                }
                else if (updateDto.ExistingImages != null)
                {
                    // No new images, but preserve the existing ones
                    campground.Images = campground.Images
                        .Where(img => updateDto.ExistingImages.Contains(img.Filename))
                        .ToList();
                }


                else if (updateDto.Images != null && updateDto.Images.Count > 0)
                {
                    foreach (var image in updateDto.Images)
                    {
                        var uploadResult = await _photoService.UploadImageAsync(image);
                        if (uploadResult.Error != null)
                        {
                            return BadRequest(new { errors = new { Images = new[] { uploadResult.Error.Message } } });
                        }

                        campground.Images.Add(new Image
                        {
                            Url = uploadResult.SecureUrl.ToString(),
                            Filename = uploadResult.PublicId
                        });
                    }
                }


                await _context.SaveChangesAsync();
                return Ok(new { message = "Successfully updated campground" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyCampgrounds([FromQuery] double latitude, [FromQuery] double longitude)
        {
            const double radiusInKm = 50.0;

            var allCampgrounds = await _context.Campgrounds
                .Include(c => c.Images)
                .ToListAsync();

            var nearby = allCampgrounds.Where(c =>
                GetDistanceInKm(c.Latitude, c.Longitude, latitude, longitude) <= radiusInKm
            ).ToList();

            return Ok(nearby);
        }

        private double GetDistanceInKm(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // Earth's radius in km
            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }


        // DELETE: api/Campgrounds/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCampground(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                {
                    return Unauthorized("User is not authenticated.");
                }

                var userId = int.Parse(userIdClaim.Value);

                var campground = await _context.Campgrounds.FindAsync(id);
                if (campground == null)
                {
                    return NotFound("Campground not found.");
                }

                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (campground.UserId != userId && userRole != "admin")
                {
                    return Forbid("You are not authorized to delete this campground.");
                }

                _context.Campgrounds.Remove(campground);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Campground deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while deleting the campground.");
            }
        }
    }
}
