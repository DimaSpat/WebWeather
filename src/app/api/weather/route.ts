export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');

  const response = await fetch(
      lat && lon ? (`https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`)
      :
      (`https://open-weather13.p.rapidapi.com/city/${city}/EN`),
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
        }
      }
  );

  const data = await response.json();
  return Response.json(data);
}