
export async function getExisitingShapes(roomId: number) {
    const res = await fetch("http://localhost:3001/canvas/" + roomId);

    if (!res.ok) {
        console.log(await res.json());
    }
    else {
        const resData = await res.json();
        const contents = resData.map((shape: any) => {
            return JSON.parse(shape.content)
        });
        return contents;
    }
}