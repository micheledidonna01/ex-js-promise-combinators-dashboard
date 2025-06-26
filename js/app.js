



async function getDashboardData(url, destination) {
    let promise;
    try{
        let prendiPromise = await fetch(`${url}?search=${destination}`);
        promise = await prendiPromise.json();
        console.log('promise:', promise);
    }catch(error){
        console.error('Error fetching data:', error);
    }

    if(promise.message){
        throw new Error(promise.message);
        
    }

    return {...promise};

}




(async () => {

    const promiseFirst = getDashboardData("http://localhost:3333/destinations","Vienna");
    const promiseSecond = getDashboardData("http://localhost:3333/weathers", "Vienna");
    const promiseThird = getDashboardData("http://localhost:3333/airports", "Vienna");
    const promiseFourth = getDashboardData("https://www.meteofittizio.it", "Vienna");
    

    const result = await Promise.allSettled([promiseFirst, promiseSecond, promiseThird, promiseFourth]);
    console.log('result:', result);
    console.log('result:', {
        name: result[0].value[0]?.name ?? null, 
        country: result[0].value[0]?.country ?? null, 
        temperature: result[1].value[0]?.temperature ?? null, 
        weather: result[1].value[0]?.weather_description ?? null, 
        airport: result[2].value[0]?.name ?? null
    });

    let message = "";

    if(result[0].value[0]?.name || result[0].value[0]?.country) {
        message += `${result[0].value[0].name} is in ${result[0].value[0].country}.\n`;
    }

    if(result[1].value[0]?.temperature || result[1].value[0]?.weather_description) {
        message += `Today there are ${result[1].value[0].temperature} degrees and the weather is ${result[1].value[0].weather_description}.\n`;
    }

    if(result[2].value[0]?.name) {
        message += `The main airport is ${result[2].value[0].name}.\n`;
    }

    console.log(message);

})();
