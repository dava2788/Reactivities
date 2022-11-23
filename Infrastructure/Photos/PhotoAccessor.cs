using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            //when we are passing the account in the
            //
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            //New instance of the account
            _cloudinary= new Cloudinary(account);
        }//end constructor PhotoAccessor

        public async Task<PhotoUploadResult> AddPhoto(IFormFile File)
        {
            if (File.Length>0)
            {
                //the using keyword because we want to dispose stream
                //because is goint to consume memory. As soon we finish this method
                //And the OpenReadStream implements the dispose method, so the using will do this work
                await using var stream = File.OpenReadStream();

                var uploadParams=new ImageUploadParams
                {
                    File=new FileDescription(File.Name,stream),
                    //Let cloudinary transform the file in a Square Image
                    Transformation= new Transformation().Height(500).Width(500).Crop("fill") 
                };

                var uploadResult= await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }//end if (uploadResult.Error != null)

                return new PhotoUploadResult
                {
                    PublicId=uploadResult.PublicId,
                    Url=uploadResult.SecureUrl.ToString()
                };
            }//end if (file.Length>0)

            return null;
        }//end AddPhoto

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result= await _cloudinary.DestroyAsync(deleteParams);
            return result.Result=="ok"? result.Result:null;
        }//end DeletePhoto

        
    }//end class PhotoAccessor : IPhotoAccessor
}//end Infrastructure.Photos