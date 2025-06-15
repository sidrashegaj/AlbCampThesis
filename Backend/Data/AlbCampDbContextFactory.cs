using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace BACKEND.Data
{
    public class AlbCampDbContextFactory : IDesignTimeDbContextFactory<AlbCampDbContext>
    {
        public AlbCampDbContext CreateDbContext(string[] args)
        {
            // Adjust base path to point to the correct folder
            var basePath = Directory.GetCurrentDirectory();

            // Check if the correct path is being resolved
            Console.WriteLine($"Base path: {basePath}");

            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            // Get connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Configure DbContextOptions
            var optionsBuilder = new DbContextOptionsBuilder<AlbCampDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new AlbCampDbContext(optionsBuilder.Options);
        }
    }
}
