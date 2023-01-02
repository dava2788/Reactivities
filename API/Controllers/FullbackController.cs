namespace API.Controllers
{
    //THIS CONTROLLER is for connect the react app with the API
    //So, if is a route the API doesn't know got to the index.html
    //this file will the responsible for route the app does not know about
    [AllowAnonymous]
    public class FullbackController :Controller
    {
        public IActionResult Index(){
            return PhysicalFile(
                Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "index.html")
                ,"text/HTML"
            );
        }//END Index
        
    }//end FullbackController
}//end namespace