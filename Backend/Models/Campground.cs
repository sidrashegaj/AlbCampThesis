using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BACKEND.Models
{
    public class Campground
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CampgroundId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Location { get; set; }

        public string Description { get; set; }
        public int Price { get; set; }

        [Required]
        public double Latitude { get; set; } // Direct latitude storage

        [Required]
        public double Longitude { get; set; } // Direct longitude storage

        public List<Image> Images { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User Author { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }



    public class CampgroundDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
    }
    public class UpdateCampgroundDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int Price { get; set; }
        public List<IFormFile>? Images { get; set; } 
        public List<string>? DeleteImages { get; set; }
        public List<string>? ExistingImages { get; set; }

    }


}