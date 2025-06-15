
using BACKEND.Models;
using System.Text.Json.Serialization;

public class Booking
{
	public int BookingId { get; set; }

	public int CampgroundId { get; set; }

	public int UserId { get; set; }

	public int Nights { get; set; }

	public decimal TotalPrice { get; set; }

	public string Status { get; set; } = "Pending";

	public DateTime BookingDate { get; set; } = DateTime.UtcNow;

	public string PhoneNumber { get; set; }

	public virtual Campground Campground { get; set; }

	public virtual User User { get; set; }
}

public class BookingDto
{
	public int CampgroundId { get; set; }
	public int UserId { get; set; }
	public int Nights { get; set; }
	public string PhoneNumber { get; set; }
}
public class BookingResponseDto
{
	public int BookingId { get; set; }
	public int Nights { get; set; }
	public decimal TotalPrice { get; set; }
	public string Status { get; set; }
	public DateTime BookingDate { get; set; }
	public string PhoneNumber { get; set; }

	public string Username { get; set; }
	public string CampgroundName { get; set; }
}
public class UpdateStatusDto
{
	public string Status { get; set; }
}
