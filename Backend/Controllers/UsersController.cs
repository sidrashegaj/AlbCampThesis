using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AlbCampDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AlbCampDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
                return BadRequest("Username already taken.");

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = string.IsNullOrEmpty(registerDto.Role) ? "user" : registerDto.Role  
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { token = GenerateJwtToken(user) });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized("Invalid credentials.");

            return Ok(new { token = GenerateJwtToken(user) });
        }

        [HttpGet]
        [Authorize(Roles = "admin")] // Only accessible by admin
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings").Get<JWTSettings>();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("UserId", user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings.Issuer,
                audience: jwtSettings.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
