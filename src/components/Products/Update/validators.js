export const isNameValid = (value) => {
	return value.trim().length > 0 && value.trim().length <= 200;
};

export const isCategoriesValid = (value) => {
	return value.length > 0 && value.length <= 5;
}

export const isFeatured = (rating) => {
	if(rating >= 8){
		return true
	}else{
		return false
	}
}

export const isDateValid = (expDate) => {
	var date = new Date();
    date.setDate(date.getDate() + 29)
	if(date.getTime() <= new Date(expDate).getTime()){
		return true
	}else{
		return false
	}
} 