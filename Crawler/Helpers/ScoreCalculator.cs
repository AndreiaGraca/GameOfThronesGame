using GameOfThronesCrawler.Models;

namespace GameOfThronesCrawler.Helpers
{
    public static class ScoreCalculator
    {
        public static Dictionary<string, int> CalculateCharacterProportions(List<GameQuestion> questions)
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

        public static int CalculateUserScore(List<GameQuestion> questions)
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

        public static string GetFavoriteCharacter(Dictionary<string, int> characterProportions)
        {
            if (characterProportions.Count == 0)
            {
                return "No favorite character";
            }

            int maxCount = characterProportions.Values.Max();
            if (characterProportions.Values.Where(x => x == maxCount).Count() > 1)
            {
                return "No favorite character";
            }

            string favoriteCharacter = characterProportions.FirstOrDefault(x => x.Value == maxCount).Key;

            return favoriteCharacter;
        }

        public static bool IsAnswerCorrect(GameQuestion question)
        {
            return question.Options.Any(option => option.IsCorrect && option.IsSelected);
        }
    }
}
