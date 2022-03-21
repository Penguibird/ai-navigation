let map: google.maps.Map | null = null;

export function initMap(): void {
  // The location of Uluru

  const dundee = { lat: 56.462038779097725, lng: -2.969849534425338 };
  // The map, centered at Uluru
  map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: dundee,
    }
  );

}

export const drawAPoint = ([x, y]: [number, number]) => {
  if (!map)
    return;
  
}