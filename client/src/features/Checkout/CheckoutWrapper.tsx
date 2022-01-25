import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
import CheckoutPage from "./CheckoutPage";

// publishable key
const stripePromise = loadStripe('pk_test_51HIv6eDRd0LwUKYJuG37UvfhAkLPaYAp2h2wJilEn66FfwzrXCWvojIUYeZ7gYZwVaZgLSPrOmL4YHlexcXc09ud00rhTlHFqT');

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [dispatch]);

    if (loading) {
        return <LoadingComponent message='Loading checkout...' />
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}