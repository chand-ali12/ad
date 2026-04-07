import Layout from "../components/layout"
import DeleteAccountComponent from "@/components/signUp-components/signUp/delectAccount";

export default function UserSignUp() {
    const seo = {
        title: "Delete",
        description: "Delete profile page",
    };
    return (
        <>
            {/* <NextSeo {...seo} />  */}
            <Layout seo={seo}>
                <DeleteAccountComponent />
            </Layout>
        </>
    );
}