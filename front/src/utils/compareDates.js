export const compareDate = (firstDate, secondDate, compareType) => {

    let needResult = compareType == 'bigger' ? true : false;
    const formattedDate = firstDate.split('.');
    const formattedSecondDate = secondDate.split('.');
    if (formattedDate[2] > formattedSecondDate[2]) {
        return needResult;
    } else if (formattedDate[2] == formattedSecondDate[2] && formattedDate[1] > formattedSecondDate[1]) {
        return needResult;
    } else if (formattedDate[2] == formattedSecondDate[2] && formattedDate[1] == formattedSecondDate[1] && formattedDate[0] >= formattedSecondDate[0]) {
        return needResult;
    } else {
        return !needResult;
    }
};