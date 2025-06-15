using Microsoft.AspNetCore.Mvc;
using BACKEND.Data;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly AlbCampDbContext _context;

        public BookingController(AlbCampDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDto bookingDto)
        {
            var campground = await _context.Campgrounds.FindAsync(bookingDto.CampgroundId);
            if (campground == null) return NotFound("Campground not found");

            var booking = new Booking
            {
                CampgroundId = bookingDto.CampgroundId,
                UserId = bookingDto.UserId,
                Nights = bookingDto.Nights,
                PhoneNumber = bookingDto.PhoneNumber,
                TotalPrice = bookingDto.Nights * campground.Price,
                Status = "Pending",
                BookingDate = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Campground)
                .Select(b => new BookingResponseDto
                {
                    BookingId = b.BookingId,
                    Nights = b.Nights,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    BookingDate = b.BookingDate,
                    PhoneNumber = b.PhoneNumber,
                    Username = b.User.Username,
                    CampgroundName = b.Campground.Name
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingsByUser(int userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Campground)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

    }
}
