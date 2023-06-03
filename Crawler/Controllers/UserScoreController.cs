using GameOfThronesCrawler.Database;
using GameOfThronesCrawler.Helpers;
using GameOfThronesCrawler.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq.Expressions;

namespace GameOfThronesCrawler.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserScoreController : ControllerBase
    {
        private readonly IMongoRepository<GameStats> _gameStatsRepository;

        public UserScoreController(IMongoRepository<GameStats> gameStatsRepository)
        {
            _gameStatsRepository = gameStatsRepository;
        }

        /// <summary>
        /// Endpoint to receive a NewGame object and return the ScoreResult
        /// </summary>
        /// <param name="newGame"></param>
        /// <returns></returns>
        [HttpPost("Post")]
        public IActionResult Post([FromBody] NewGame newGame)
        {
            if (newGame == null || newGame.Questions == null || newGame.Questions.Count == 0)
            {
                return BadRequest("Invalid game data");
            }

            int score = ScoreCalculator.CalculateUserScore(newGame.Questions);
            var characterProportions = ScoreCalculator.CalculateCharacterProportions(newGame.Questions);
            string favoriteCharacter = ScoreCalculator.GetFavoriteCharacter(characterProportions);

            var result = new ScoreResult
            {
                UserName = newGame.UserName,
                Score = score,
                FavoriteCharacter = favoriteCharacter
            };

            GameStats gameStats = new();
            gameStats.UserName = newGame.UserName;
            gameStats.GivenAnswers = newGame.Questions;
            gameStats.Score = score;

            _gameStatsRepository.InsertOne(gameStats);

            return Ok(result);
        }

        /// <summary>
        /// Endpoint to delete all scores in the database
        /// </summary>
        /// <param name="newGame"></param>
        /// <returns></returns>
        [HttpDelete("Delete")]
        public IActionResult Delete()
        {
            Expression<Func<GameStats, bool>> filterExpression = x => true;
            _gameStatsRepository.DeleteMany(filterExpression);

            return Ok();
        }
    }
}
