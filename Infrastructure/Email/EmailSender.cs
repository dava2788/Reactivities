using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration _config;
        public EmailSender(IConfiguration config)
        {
            _config = config;
        }//end constructor

        public async Task SendEmailAsync(string userEmail, string emailSubject, string msg)
        {
            var client = new SendGridClient(_config["SendGrid:Key"]);
            var message = new SendGridMessage
            {
                From = new EmailAddress("dava2788@gmail.com",_config["SendGrid:User"]),
                Subject=emailSubject,
                PlainTextContent=msg,
                HtmlContent=msg
            };

            message.AddTo(new EmailAddress(userEmail));
            message.SetClickTracking(false,false);

            await client.SendEmailAsync(message);

        }//end SendEmailAsync
    }//end EmailSender
}//end namespace