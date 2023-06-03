using MongoDB.Bson;

namespace GameOfThronesCrawler.Database
{
    public abstract class Document : IDocument
    {
        public ObjectId Id { get; set; }

        public DateTime CreatedAt => Id.CreationTime;
    }
}
