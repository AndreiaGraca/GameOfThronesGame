using GameOfThronesCrawler.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace GameOfThronesCrawler.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CharactersController : ControllerBase
    {
        /// <summary>
        /// Endpoint to get a list of GameQuestions
        /// </summary>
        /// <returns></returns>
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            GetCharacters.GetCharactersAndSaveInAJson();

            return Ok();
        }
    }
}
