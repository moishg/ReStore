import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";

// publishable key
const stripePromise=loadStripe('pk_test_51HIv6eDRd0LwUKYJuG37UvfhAkLPaYAp2h2wJilEn66FfwzrXCWvojIUYeZ7gYZwVaZgLSPrOmL4YHlexcXc09ud00rhTlHFqT');

export default function  CheckoutWrapper(){
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}