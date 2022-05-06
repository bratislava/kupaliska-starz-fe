import { SectionHeader } from "components";
import React from "react";
import { useTranslation } from "react-i18next";

const WhyCreateAccountSection = () => {
    const { t } = useTranslation();

    return <section id="why-create-account" className="section">
        <SectionHeader title="Prečo si založiť účet?" className="text-center"/>
        {[0,1,2].map((index) => <div
            className={`flex lg:w-8/10 mx-auto flex-col-reverse mb-10 md:mb-0 ${index % 2 == 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            key={index}>
            <div className="flex-1 flex justify-center items-center text-center mt-6 md:mt-0">
                <div className="w-80">
                    <div className="font-semibold text-2xl mb-6">{t(`landing.why-create-account.${index}.title`)}</div>
                    <p>{t(`landing.why-create-account.${index}.content`)}</p>
                </div>
            </div>
            <div className="flex flex-none justify-center"><img
                src={`phone-${index + 1}.png`}
            /></div>
        </div>)}
    </section>;
};

export default WhyCreateAccountSection;
