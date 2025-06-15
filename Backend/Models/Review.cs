using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BACKEND.Models;

public class Review
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ReviewId { get; set; }

    [Required]
    public string Text { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; }

    [ForeignKey("Campground")]
    public int CampgroundId { get; set; }
    public Campground Campground { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }
}
public class ReviewDto
{
    public string Text { get; set; }
    public int UserId { get; set; }
    public int CampgroundId { get; set; }
    public int Rating { get; set; }
}
