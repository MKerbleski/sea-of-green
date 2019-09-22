export const convertHex = (hex,opacity) => {
    const newHex = hex.replace('#','')
    const r = parseInt(newHex.substring(0,2), 16);
    const g = parseInt(newHex.substring(2,4), 16);
    const b = parseInt(newHex.substring(4,6), 16);

    const result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

export const twentyMostContrastingColors = ['#e6194b', '3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000'] //from https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/

export const getSomeRGBAColors = (number, opacity=100) => {
    const colors = twentyMostContrastingColors.slice(0,number)
    
    const result = colors.map(color => {
        return convertHex(color, opacity)
    })
    if(result.length < number){
        while(result.length < number){
            result.push(getRandomColor(opacity))
        }
        return result
    } else {
        return result
    }
}

export const getRandomColor = (opacity) => {
    return `rgba(${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, ${opacity/100} )`
}