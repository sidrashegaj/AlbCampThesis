using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class DbInitializer
    {
        public static void Initialize(AlbCampDbContext context)
        {
            Console.WriteLine("Initializing database...");

            context.Database.EnsureCreated();

            var sidra = context.Users.FirstOrDefault(u => u.Username == "sidra");
            if (sidra == null)
            {
                Console.WriteLine("Adding default user Sidra...");
                sidra = new User
                {
                    Username = "sidra",
                    Email = "shegasidra@yahoo.com",
                    Password = "$2a$11$UFEtrUwo24ceN/H46w7a2OO1aQAzwtcGR3L.VfQ9hpFaFI6hboKo2" 
                };
                context.Users.Add(sidra);
                context.SaveChanges();
                Console.WriteLine("Default user Sidra added.");
            }
            else
            {
                Console.WriteLine("Default user Sidra already exists.");
            }

            // Seed campgrounds
            if (!context.Campgrounds.Any())
            {
                Console.WriteLine("Seeding new campgrounds...");
                var albanianCampgrounds = new List<Campground>
                {
                    new Campground { UserId = sidra.UserId, Name = "Syri i Kaltër", Location = "Sarandë, Albania", Description = "A breathtaking natural spring", Latitude = 39.9291, Longitude = 20.1923, Price = 20 },
                    new Campground { UserId = sidra.UserId, Name = "Llogara", Location = "Llogara National Park, Albania", Description = "Amazing mountain views", Latitude = 40.2293, Longitude = 19.6117, Price = 25 },
                    new Campground { UserId = sidra.UserId, Name = "Valbona", Location = "Valbona Valley, Albania", Description = "A peaceful retreat in the Alps", Latitude = 42.4389, Longitude = 19.8864, Price = 15 },
                    new Campground { UserId = sidra.UserId, Name = "Theth", Location = "Theth National Park, Albania", Description = "A remote and beautiful village", Latitude = 42.3959, Longitude = 19.7745, Price = 15 },
                    new Campground { UserId = sidra.UserId, Name = "Koman Lake", Location = "Koman, Albania", Description = "A stunning lake surrounded by mountains", Latitude = 42.1674, Longitude = 19.7864, Price = 18 },
                    new Campground { UserId = sidra.UserId, Name = "Bovilla", Location = "Bovilla, Albania", Description = "A scenic spot near Tirana", Latitude = 41.4452, Longitude = 19.8746, Price = 10 },
                    new Campground { UserId = sidra.UserId, Name = "Gjiri i Lalëzit", Location = "Durrës, Albania", Description = "Beautiful beach camping", Latitude = 41.4939, Longitude = 19.5253, Price = 12 },
                    new Campground { UserId = sidra.UserId, Name = "Divjakë-Karavasta", Location = "Divjakë, Albania", Description = "A nature park with rich biodiversity", Latitude = 40.9981, Longitude = 19.5025, Price = 17 },
                    new Campground { UserId = sidra.UserId, Name = "Pogradec", Location = "Lake Ohrid, Albania", Description = "Lakeside camping with amazing views", Latitude = 40.9006, Longitude = 20.6627, Price = 14 },
                    new Campground { UserId = sidra.UserId, Name = "Gjirokastër", Location = "Gjirokastër, Albania", Description = "A historic city with unique camping spots", Latitude = 40.0755, Longitude = 20.1414, Price = 22 }
                };

                context.Campgrounds.AddRange(albanianCampgrounds);
                context.SaveChanges();
                Console.WriteLine("Campgrounds seeded successfully.");
            }
            else
            {
                Console.WriteLine("Campgrounds already exist. Skipping seeding.");
            }
        }
    }
}
