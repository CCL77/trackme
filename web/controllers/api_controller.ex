defmodule XUber.ApiController do
  use XUber.Web, :controller


  def index(conn, _params) do
    users = [
      %{name: "Joe",
        email: "joe@example.com",
        password: "topsecret",
        stooge: "moe"},
      %{name: "Anne",
        email: "anne@example.com",
        password: "guessme",
        stooge: "larry"},
      %{name: "Franklin",
        email: "franklin@example.com",
        password: "guessme",
        stooge: "curly"},
    ]

    json conn, users
  end


  def create(conn, params) do
    #json conn, params

    json conn, XUber.Endpoint.broadcast("socket", "move", params)
    # json conn, Phoenix.Socket.Broadcast{topic: "test", event: "moved", payload: params}

    # curl -H "Content-Type: application/json"  -d '{"name":"value1", "coords":{"latitude":"7.2531
    # 60", "longitude":"46.916109"}}' -X POST http://localhost:4000/api/create
    # "ok"
  end
end
