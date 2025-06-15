using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{

    public class Image
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ImageId { get; set; }  // Primary Key
        public string Url { get; set; }
        public string Filename { get; set; }
        [ForeignKey("Campground")]
        public int CampgroundId { get; set; }
        public Campground Campground { get; set; }
    }
}

