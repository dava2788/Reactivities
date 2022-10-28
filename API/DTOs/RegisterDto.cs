using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    //THe DataAnnotations help us give validation to each field in the register
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$",ErrorMessage ="Password must be complex")]
        public string Password { get; set; }
        [Required]
        public string Username { get; set; }
        
    }//end class RegisterDto
}//end namespace