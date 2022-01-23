import * as yup from 'yup';
export const validationSchema = [
    yup.object({//for the checkout form
        fullName: yup.string().required('Full name is required'),
        address1: yup.string().required('Aaddress line 1  is required'),
        address2: yup.string().required('Aaddress line 2  is required'),
        city: yup.string().required(),
        state: yup.string().required(),
        zip: yup.string().required(),
        country: yup.string().required()
    }),
    yup.object(),//for the rerview form
    yup.object({//for the payment form
        nameOnCard:yup.string().required()
            
    })

]