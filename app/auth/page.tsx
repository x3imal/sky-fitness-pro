import AuthModal from "@/components/AuthModal/AuthModal";
import HomePageContent from "@/components/HomePageContent/HomePageContent";

export default function AuthPage() {
    return (
        <>
            <HomePageContent />
            <AuthModal showOverlay showClose={false} />
        </>
    );
}
