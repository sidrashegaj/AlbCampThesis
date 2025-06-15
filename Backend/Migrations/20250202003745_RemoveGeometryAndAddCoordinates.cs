using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Migrations
{
    /// <inheritdoc />
    public partial class RemoveGeometryAndAddCoordinates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Geometry_Coordinates",
                table: "Campgrounds");

            migrationBuilder.DropColumn(
                name: "Geometry_Type",
                table: "Campgrounds");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Campgrounds",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Campgrounds",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Campgrounds");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Campgrounds");

            migrationBuilder.AddColumn<double[]>(
                name: "Geometry_Coordinates",
                table: "Campgrounds",
                type: "double precision[]",
                nullable: false,
                defaultValue: new double[0]);

            migrationBuilder.AddColumn<string>(
                name: "Geometry_Type",
                table: "Campgrounds",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
