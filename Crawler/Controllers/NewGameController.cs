using GameOfThronesCrawler.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace GameOfThronesCrawler.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewGameController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const int NumberOfQuotes = 10;


        public NewGameController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            var quotes = await GetRandomQuotes(NumberOfQuotes);
            var gameQuestions = PrepareGameQuestions(quotes);

            return Ok(gameQuestions);
        }

        #region Helper Functions
        private async Task<List<GameQuestion>> PrepareGameQuestions(List<Quote> quotes)
        {
            //TODO: Clean backlashes from all strings
            var gameQuestions = new List<GameQuestion>();

            foreach (var quote in quotes)
            {
                var options = ShuffleCharacters(quote.Character.Name);
                var gameQuestion = new GameQuestion
                {
                    Quote = quote.Sentence,
                    Options = options
                };

                gameQuestions.Add(gameQuestion);
            }

            return gameQuestions;
        }

        private async Task<List<Quote>> GetRandomQuotes(int count)
        {
            var quotes = new List<Quote>();

            for (var i = 0; i < count; i++)
            {
                var response = await _httpClient.GetAsync("https://api.gameofthronesquotes.xyz/v1/random");

                if (!response.IsSuccessStatusCode)
                {
                    continue;
                }

                var quote = await response.Content.ReadFromJsonAsync<Quote>();
                quotes.Add(quote);
            }

            return quotes;
        }

        private List<GameQuestionOption> ShuffleCharacters(string correctOption)
        {
            //TODO: Substitute Characters with actual names
            var options = new List<GameQuestionOption>
            {
                new GameQuestionOption { Option = correctOption, IsCorrect = true},
                new GameQuestionOption { Option = "Character 2", IsCorrect = false},
                new GameQuestionOption { Option = "Character 3", IsCorrect = false },
                new GameQuestionOption { Option = "Character 4", IsCorrect = false}
            };

        // Shuffling the characters
            var random = new Random();
            var shuffledCharacters = options.OrderBy(x => random.Next()).ToList();

            return shuffledCharacters;
        }
        #endregion
    }
}
