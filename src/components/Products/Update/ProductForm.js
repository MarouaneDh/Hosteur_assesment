import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { getMultiSelected, repeat } from '../../../utils';
import { isCategoriesValid, isNameValid, isFeatured, isDateValid } from './validators';
import { createProduct, updateProductForm } from '../../../actions/products';

const ProductForm = (props) => {
    const { product = {}, dispatch, type } = props;
    const [name, setName] = useState(product.name || '');
    const [brand, setBrand] = useState(product.brand || '');
    const [rating, setRating] = useState(product.rating || 0);
    const [categories, setCategories] = useState(product.categories || []);
    const [itemsInStock, setItemsInStock] = useState(product.itemsInStock || 0);
    const [receiptDate, setReceiptDate] = useState(product.receiptDate || '');
    const [expirationDate, setExpirationDate] = useState(product.expirationDate || '');
    const [featured, setFeatured] = useState(product.featured|| false);
    const [validFeatured, setValidFeatured] = useState(false)
    const [validNotFeatured, setValidNotFeatured] = useState(false)
    const [validExpDate, setValidExpDate] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault();
        if(isFeatured(rating) ===true && featured===true){
            if(isDateValid(expirationDate)){
                if(type === 'add'){
                    dispatch(createProduct({
                        name: name,
                        brand: brand,
                        rating: rating,
                        categories: categories,
                        itemsInStock: itemsInStock,
                        receiptDate: receiptDate,
                        expirationDate: expirationDate,
                        featured: featured,
                    }))
                }else if(type === 'edit'){
                    dispatch(updateProductForm(product.id,{
                        name: name,
                        brand: brand,
                        rating: rating,
                        categories: categories,
                        itemsInStock: itemsInStock,
                        receiptDate: receiptDate,
                        expirationDate: expirationDate,
                        featured: featured,
                    }))
                }
                window.history.back()
            }else{
                setValidExpDate(true)
            }
        }else if(isFeatured(rating)===true && featured=== false){
            setValidFeatured(true)
        }else if(isFeatured(rating)===false && featured=== true){
            setValidNotFeatured(true)
        }
    }

    useEffect(() => {
      if(featured){
        setValidFeatured(false)
      }
      if(!featured){
        setValidNotFeatured(false)
      }
    }, [featured])
    
    useEffect(() => {
        if(isDateValid(expirationDate)){
            setValidExpDate(false)
        }
      }, [expirationDate])

    var date = new Date();
    date.setDate(date.getDate() + 30)

    let stringDate = date.toDateString()

    let expiration =`${stringDate.split(' ')[0]} ${stringDate.split(' ')[1]} ${stringDate.split(' ')[2]} ${stringDate.split(' ')[3]}`

    console.log()

    return (
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <Label for='name'>Name</Label>
                <Input
                    invalid={!isNameValid(name)}
                    type='text'
                    name='name'
                    id='name'
                    placeholder='Name'
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                />
                <FormFeedback>Name is required, the length must not be greater than 200</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label for='brand'>Brand</Label>
                <Input
                    type='text'
                    name='brand'
                    id='brand'
                    placeholder='Brand'
                    value={brand}
                    onChange={({ target }) => setBrand(target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="rating">Rating</Label>
                <Input
                    type="select"
                    name="rating"
                    id="rating"
                    value={rating}
                    onChange={({ target }) => setRating(target.value)}
                >
                    {repeat(11).map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="categories">Categories</Label>
                <Input
                    invalid={!isCategoriesValid(categories)}
                    type="select"
                    name="categories"
                    id="categories"
                    multiple
                    value={categories}
                    onChange={({ target }) => setCategories(getMultiSelected(target))}
                >
                    {props.categories.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </Input>
                <FormFeedback>A product must have from 1 to 5 categories</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label for="itemsInStock">Items In Stock</Label>
                <Input type="number" name="itemsInStock" id="itemsInStock" value={itemsInStock}
                    onChange={({ target }) => setItemsInStock(target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="expirationDate">Expiration date</Label>
                <Input
                    type="date"
                    name="expirationDate"
                    id="expirationDate"
                    value={expirationDate}
                    onChange={({ target }) => setExpirationDate(target.value)}
                />
                {validExpDate? <span className='featuredErrorMessage'>The expiration date should be at least after 30 days from today starting from {expiration}</span>:null}
                <FormFeedback>If a product has an expiration date it must expire not less than 30 days since
                    now</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label for="receiptDate">Receipt date</Label>
                <Input type="date" name="receiptDate" id="receiptDate" value={receiptDate}
                    onChange={({ target }) => setReceiptDate(target.value)}
                />
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" checked={featured}
                        onChange={({ target }) => setFeatured(target.checked)}
                    />{' '}
                    Featured
                </Label>
                {validFeatured? <span className='featuredErrorMessage'>this product shoud be featured, please check the box before submitting your product or reduce the rating below 8</span>:null}
                {validNotFeatured? <span className='featuredErrorMessage'>this product shoud not be featured, its rating is below 8, please uncheck the box before submitting your product or increase the rating over or equal to 8</span>:null}
            </FormGroup>
            
                <Button>Submit</Button>
        </Form>
    );
}

ProductForm.propTypes = {
    product: PropTypes.object,
    categories: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ProductForm;
