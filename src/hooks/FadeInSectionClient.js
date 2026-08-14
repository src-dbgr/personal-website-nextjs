import dynamic from "next/dynamic";

const FadeInSection = dynamic(() => import("./FadeInSection"), {
  ssr: false,
  loading: () => <div>Loading ...</div>,
});

export default FadeInSection;
