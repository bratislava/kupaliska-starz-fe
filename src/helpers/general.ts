export const assignItemsToColumns = (numberOfColumns: 1 | 2 | 3, items: any[]): any[][] => {

    const result: any[][] = Array.from({ length: numberOfColumns }, () => []);
    if (numberOfColumns === 3 && items.length % 3 === 1) {
        items.forEach((item, index) => {
            if (index === items.length - 1) {
                result[1].push(item)
            } else {
                result[index % numberOfColumns].push(item);

            }
        })

    } else {
        items.forEach((item, index) => result[index % numberOfColumns].push(item));
    }
    console.log(result);
    return result;

}