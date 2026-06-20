// export function textCapitalizer(data: string) : string{
//     if(!data){
//         return ""
//     }

//     let tempArray: string[] = (data.trim()).split(" ")
    
//     let capitalized = ""
    
//     tempArray.forEach((ele)=>{
//         capitalized += ele[0].toUpperCase() + ele.substring(1).toLowerCase() + " "
//     })
 
//  return capitalized  
// }

export function textCapitalizer(data: string): string {
    if (!data) {
        return "";
    }

    return data
        .trim()
        .split(/\s+/) // Splitting on one or more spaces to remove empty elements
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizing first letter
        .join(" "); // Joining back with single space
}