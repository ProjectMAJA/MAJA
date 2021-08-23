module.exports = function setQuerySave(e, AR){

   /* 
    if(e.deezer_ids){
        e.deezer_ids = e.deezer_ids.replace('[', '{');
        e.deezer_ids = e.deezer_ids.replace(']', '}');
    }
    
    */

    const sets = [];
    const values = [];
    if(e.id){
        values.push(e.id);
        for (const prop in e) {
            if(prop === "id") {
                continue;
            }
            values.push(e[prop]);
            const clmnName = prop;
            const paramNb = values.length;
            sets.push(`${clmnName} = $${paramNb}`);
        }
        return {
            text: `UPDATE "${AR}" SET ${sets} WHERE id=$1 RETURNING *;`,
            values: values            
        } 
    }else{
        const paramsNb=[];
        for (const prop in e) {
            values.push(e[prop]);
            const clmnName = prop;
            const paramNb = values.length;
            sets.push(`${clmnName}`);
            paramsNb.push(`$${paramNb}`);
        }
        return {
            text: `INSERT INTO "${AR}" (${sets}) VALUES (${paramsNb}) RETURNING *`,
            values: values
        } 
    }
}