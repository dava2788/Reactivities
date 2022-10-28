using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//DTO->DAta transfer Objects
namespace API.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }// class LoginDto
}//end namespace