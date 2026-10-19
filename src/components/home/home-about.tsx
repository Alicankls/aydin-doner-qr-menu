import Image from "next/image";
import { getStaticImage } from "@/lib/static-image";

/** "Hakkımızda": white section between the marquee band and the menu. */
export function HomeAbout() {
  const photo = getStaticImage("images/hakkimizda.jpg");

  return (
    <section id="hakkimizda" className="cine-about" aria-labelledby="hakkimizda-baslik">
      <div className="cine-about-grid">
        <div className="cine-about-text">
          <p className="cine-about-eyebrow" data-about-item="">
            Hakkımızda
          </p>
          <h2 id="hakkimizda-baslik" className="cine-about-title" data-about-item="">
            <span className="cine-about-title-strong">Yakup Usta&apos;nın</span>
            <em className="cine-about-title-em">ellerinden</em>
          </h2>
          <span className="cine-about-orn" aria-hidden="true" data-about-item="" />
          <p className="cine-about-copy" data-about-item="">
            10 yılı aşkın süredir sanayi bölgesinde tabldot ve döner yapıyoruz. Et döner de, tavuk
            döner de Yakup ustanın ellerinden: bildiğiniz tat, sıcak sıcak, her gün aynı özenle.
          </p>
          <p className="cine-about-sign" data-about-item="">
            <span className="cine-about-sign-name">&mdash; Yakup Usta</span>
            <span className="cine-chip">Et döner</span>
            <span className="cine-chip">Tavuk döner</span>
          </p>
        </div>

        <figure className="cine-about-media" data-about-media="">
          <span className="cine-about-frame" aria-hidden="true" />
          <div className="cine-about-photo">
            {photo ? (
              <Image
                src={photo}
                alt="Yakup Usta'nın mutfağında ateşin önünde dönen büyük bir döner şişi"
                fill
                sizes="(max-width: 900px) 88vw, 480px"
                loading="lazy"
                className="cine-about-img"
              />
            ) : (
              <span className="cine-about-placeholder" aria-hidden="true" />
            )}
            <span className="cine-about-shade" aria-hidden="true" />
          </div>
        </figure>
      </div>
    </section>
  );
}
