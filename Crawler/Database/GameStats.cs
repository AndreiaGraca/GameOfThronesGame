using GameOfThronesCrawler.Models;

namespace GameOfThronesCrawler.Database
{
    [BsonCollection("scores")]
    public class GameStats : Document
    {
        public string UserName { get; set; }
        public int Score { get; set; }
        public List<GameQuestion> GivenAnswers { get; set; }
    }
}
