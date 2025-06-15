using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Migrations
{
    /// <inheritdoc />
    public partial class AddPhoneNumberToBookingTwo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Bookings",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Bookings");
        }
    }
}
