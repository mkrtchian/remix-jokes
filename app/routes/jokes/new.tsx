export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label htmlFor="name">
            Name: <input type="text" name="name" id="name" />
          </label>
        </div>
        <div>
          <label htmlFor="content">
            Content: <textarea name="content" id="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
