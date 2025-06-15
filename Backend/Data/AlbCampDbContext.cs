using Microsoft.EntityFrameworkCore;
using BACKEND.Models;

namespace BACKEND.Data
{
    public class AlbCampDbContext : DbContext
    {
        public AlbCampDbContext(DbContextOptions<AlbCampDbContext> options) : base(options) { }

        public DbSet<Campground> Campgrounds { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Booking> Bookings { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
