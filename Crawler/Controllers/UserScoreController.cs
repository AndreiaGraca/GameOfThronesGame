using GameOfThronesCrawler.Models;
using Microsoft.AspNetCore.Mvc;

namespace GameOfThronesCrawler.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserScoreController : ControllerBase
    {
        [HttpPost("Post")]
        public IActionResult Post([FromBody] NewGame newGame)
        {
            if (newGame == null || newGame.Questions == null || newGame.Questions.Count == 0)
            {
                return BadRequest("Invalid game data");
            }

            int score = CalculateUserScore(newGame.Questions);
            var characterProportions = CalculateCharacterProportions(newGame.Questions);
            string favoriteCharacter = GetFavoriteCharacter(characterProportions);

            var result = new ScoreResult
            {
                Score = score,
                FavoriteCharacter = favoriteCharacter
            };

            return Ok(result);
        }

        #region Helper functions
        private Dictionary<string, int> CalculateCharacterProportions(List<GameQuestion> questions)
        {
            var characterCounts = new Dictionary<string, int>();

            foreach (var question in questions)
            {
                var selectedOption = question.Options.FirstOrDefault(option => option.IsSelected && option.IsCorrect);

                if (selectedOption != null)
                {
                    if (characterCounts.ContainsKey(selectedOption.Option))
                    {
                        characterCounts[selectedOption.Option]++;
                    }
                    else
                    {
                        characterCounts[selectedOption.Option] = 1;
                    }
                }
            }

            return characterCounts;
        }

        private int CalculateUserScore(List<GameQuestion> questions)
        {
            int score = 0;

            foreach (var question in questions)
            {
                if (IsAnswerCorrect(question))
                {
                    score++;
                }
            }

            return score;
        }

        private string GetFavoriteCharacter(Dictionary<string, int> characterProportions)
        {
            if (characterProportions.Count == 0)
            {
                return "No favorite character";
            }

            int maxCount = characterProportions.Values.Max();
            if(characterProportions.Values.Where(x => x == maxCount).Count() > 1)
            {
                return "No favorite character";
            }

            string favoriteCharacter = characterProportions.FirstOrDefault(x => x.Value == maxCount).Key;

            return favoriteCharacter;
        }

        private bool IsAnswerCorrect(GameQuestion question)
        {
            return question.Options.Any(option => option.IsCorrect && option.IsSelected);
        }
        #endregion
    }
}
