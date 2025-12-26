// Funkcja sortująca psy po boxie (litera, potem liczba)
export function sortDogsByBox<T extends { box: string }>(dogs: T[]): T[] {
  return dogs.slice().sort((a, b) => {
    const boxA = a.box.match(/([A-Za-z]+)(\d+)/);
    const boxB = b.box.match(/([A-Za-z]+)(\d+)/);
    if (!boxA || !boxB) return a.box.localeCompare(b.box);
    const [_, letterA, numA] = boxA;
    const [__, letterB, numB] = boxB;
    if (letterA !== letterB) return letterA.localeCompare(letterB);
    return parseInt(numA, 10) - parseInt(numB, 10);
  });
}

