//Request Query Counter
export const queryCounter = (data) => {
    const keyArr = Object.keys(data);
    const obj = {
        userId: 1,
        category: 1,
        subcategory: 1
    }
    let count = 0;
    
    keyArr.map((index)=> {
        if (index in obj) {
            count++;
        }
    })
    return count;
}