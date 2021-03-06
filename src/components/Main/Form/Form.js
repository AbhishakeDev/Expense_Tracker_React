import React, { useState, useContext, useEffect } from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import useStyles from './styles';
import { v4 as uuidv4 } from 'uuid';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import { ExpenseTrackerContext } from '../../../context/context';
import { useSpeechContext } from '@speechly/react-client';
import formatDate from '../../../utils/formatDate';
import CustomizedSnackBar from '../../SnackBar/Snackbar';

const initialState = {
    amount: '',
    category: '',
    type: 'Income',
    date: formatDate(new Date())
}

const Form = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    // console.log(formData)
    const { addTransaction } = useContext(ExpenseTrackerContext);
    const { segment } = useSpeechContext();
    const [open, setOpen] = useState(false);


    const createTransaction = () => {
        if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;
        const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() }
        setOpen(true);
        addTransaction(transaction)
        setFormData(initialState)
    }

    useEffect(() => {
        if (segment) {
            if (segment.intent.intent === 'add_expense') {
                setFormData({ ...formData, type: 'Expense' });
            }
            else if (segment.intent.intent === 'add_income') {
                setFormData({ ...formData, type: 'Income' });
            }
            else if (segment.isFinal && segment.intent.intent === "create_transaction") {
                return createTransaction();
            }
            else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
                return setFormData(initialState);
            }

            segment.entities.forEach(e => {
                const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`
                // console.log(e.value);
                switch (e.type) {
                    case 'amount':
                        setFormData({ ...formData, amount: e.value })
                        break;
                    case 'category':
                        if (incomeCategories.map((ic) => ic.type).includes(category)) {
                            setFormData({ ...formData, type: "Income", category })
                        } else if (expenseCategories.map((ic) => ic.type).includes(category)) {
                            setFormData({ ...formData, type: "Expense", category })
                        }
                        break;
                    case 'date':
                        setFormData({ ...formData, date: e.value })
                        break;
                    default:
                        break;
                }
            });
            if (segment.isFinal && formData.amount && formData.category && formData.date && formData.type) {
                createTransaction();
            }
        }
    }, [segment])

    const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

    const onChange = (e) => {
        if ([e.target.name] === "date") {
            setFormData({
                ...formData,
                [e.target.name]: formatDate(e.target.value)
            })
        }
        else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }

    }

    return (
        <Grid container spacing={2}>
            <CustomizedSnackBar open={open} setOpen={setOpen} />
            <Grid xs={12} item>
                <Typography align="center" variant="subtitle2" gutterBottom>
                    {segment &&
                        <>{segment.words.map(w => w.value).join(" ")} </>
                    }
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={formData.type} onChange={onChange} name="type">
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={formData.category} onChange={onChange} name="category">
                        {selectedCategories.map(c => <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField type="number" label="Amount" fullWidth value={formData.amount} onChange={onChange} name="amount" />
            </Grid>
            <Grid item xs={6}>
                <TextField type="date" label="Date" fullWidth value={formData.date} onChange={onChange} name="date" />
            </Grid>
            <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
        </Grid>
    )
}

export default Form
