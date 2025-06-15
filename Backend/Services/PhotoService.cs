using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;

namespace BACKEND.Services
{
    public class PhotoService
    {
        private readonly Cloudinary _cloudinary;

        public PhotoService(IOptions<CloudinarySettings> config)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));

            if (string.IsNullOrEmpty(config.Value.CloudName) ||
                string.IsNullOrEmpty(config.Value.ApiKey) ||
                string.IsNullOrEmpty(config.Value.ApiSecret))
            {
                throw new ArgumentException("Cloudinary settings are not properly configured.");
            }

            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }


        public async Task<ImageUploadResult> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File cannot be null or empty", nameof(file));

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Width(500).Height(500).Crop("fill")
            };

            return await _cloudinary.UploadAsync(uploadParams);
        }

        public async Task DeleteImageAsync(string publicId)
        {
            if (string.IsNullOrWhiteSpace(publicId))
            {
                Console.WriteLine("Skipping deletion: PublicId is null or empty.");
                return;
            }

            var deletionParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deletionParams);

            if (result.Result != "ok")
            {
                Console.WriteLine($"Failed to delete image with PublicId: {publicId}");
            }
        }

    }
}
