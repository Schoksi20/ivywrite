"use client";

import { useEffect, useRef } from "react";
import { AnimatedSection } from "./stats";

interface Message {
  text: string;
  sent?: boolean;
  time: string;
}

interface Testimonial {
  avatar: string;
  name: string;
  school: string;
  messages: Message[];
}

const testimonials: Testimonial[] = [
  {
    avatar: "P", name: "Prachi Agrawal", school: "Northwestern University",
    messages: [
      { text: "Congratulations on your acceptance to the Master of Engineering Management at Northwestern University. Welcome to the Wildcat community!", time: "3:55 PM" },
      { text: "Congratulations!! \u{1F389}", sent: true, time: "3:57 PM" },
      { text: "Thank you \u{1F64F}", time: "3:57 PM" },
    ],
  },
  {
    avatar: "S", name: "Sahil", school: "Columbia University",
    messages: [
      { text: "Dudeeeeeeee Columbia me hogya!!! I got in, I am actually in tears. Thanks man!!!", time: "3:38 PM" },
      { text: "Lets fucking gooo!! You deserve it \u{1F389}\u{1F389}", sent: true, time: "3:39 PM" },
      { text: "10k merit based scholarship too, I think we can negotiate more", time: "3:39 PM" },
      { text: "Absolutely, I will start drafting an email", sent: true, time: "3:40 PM" },
    ],
  },
  {
    avatar: "A", name: "Arjun", school: "Kellogg School of Management",
    messages: [
      { text: "Bro got into the best Marketing program in the world \u{1F60E}\u{1F355}", time: "6:42 PM" },
      { text: "Whatt!! KELLOGG se aagya????", sent: true, time: "6:42 PM" },
      { text: "Yessir \u{1F60E} Kitti scholarship?", time: "6:43 PM" },
      { text: "120k \u{1F602}\u{1F602} wow almost free", time: "6:43 PM" },
      { text: "Lets go yarr! Maja aagya \u{1F38A}", sent: true, time: "6:43 PM" },
    ],
  },
  {
    avatar: "R", name: "Rohit", school: "Duke University",
    messages: [
      { text: "Sir got my decision from Duke. I got in!!", time: "4:15 PM" },
      { text: "Ohh congratulations!! \u{1F389} I can finally say UpBroad is going somewhere", sent: true, time: "4:16 PM" },
      { text: "They rejected me \u{1F605} while I was applying, although I got into Columbia \u{2014} but Duke's rejection still hurt", time: "4:17 PM" },
      { text: "Haha I guess I have avenged you", time: "4:17 PM" },
      { text: "Yes of course \u{1F604}", sent: true, time: "4:18 PM" },
    ],
  },
  {
    avatar: "N", name: "Nikhil", school: "UCLA",
    messages: [
      { text: "UCLA ka aagya!! I got in, thank you so much for all the help!!", time: "4:19 PM" },
      { text: "Ohhh seriously let's go!! \u{1F389}", sent: true, time: "4:19 PM" },
      { text: "Badiya bhai aaj raat me party \u{1F355}\u{1F355}", sent: true, time: "4:20 PM" },
      { text: "Ha ha no need, ab Yale me daalte hai", time: "4:21 PM" },
      { text: "Why not \u{1F604}", sent: true, time: "4:21 PM" },
    ],
  },
  {
    avatar: "V", name: "Varun", school: "Cornell University",
    messages: [
      { text: "Sir Cornell ka aagya hogya mera \u{1F62D}", time: "4:25 PM" },
      { text: "Oh bhaiiiii made my day!! \u{1F389}", sent: true, time: "4:25 PM" },
      { text: "Badiya bhai Ivy League vale hogye tum to", time: "4:26 PM" },
      { text: "Are sir couldn't have done it without you", time: "4:26 PM" },
      { text: "Are bhai itti amazing profile kaise nhi hota \u{1F60A}", sent: true, time: "4:26 PM" },
    ],
  },
  {
    avatar: "A", name: "Amulya Kant", school: "UC San Diego (Rady MQF)",
    messages: [
      { text: "Couldn't have done this without your help. Thank you so much!", time: "8:23 AM" },
      { text: "Lets fucking go!!!! \u{2764}\u{FE0F}", sent: true, time: "8:42 AM" },
      { text: "Badiya bhai, UC San Diego aagya hai sbse pehla hi shandar!", time: "8:45 AM" },
    ],
  },
  {
    avatar: "T", name: "Team chat", school: "UC Berkeley",
    messages: [
      { text: "Hi team the results are out, got into Berkeley!!! Waiting for UChicago and Columbia now", time: "10:09 AM" },
      { text: "Best diwali gift ever? Congratulations!! \u{1F389}\u{1F38A}", sent: true, time: "10:10 AM" },
      { text: "15k scholarship as of now but will send them an email to negotiate", time: "10:11 AM" },
      { text: "Okay, I will send you the template asap. Let's celebrate! \u{1F942}", sent: true, time: "10:11 AM" },
    ],
  },
  {
    avatar: "A", name: "Anshul", school: "Dartmouth College",
    messages: [
      { text: "Thankyou to the entire team of Upbroad, without you this wouldn't have been possible. @Anushk it was great speaking to you on vc \u{2014} thankgod I went with you guys and didn't go ahead with Yocket or gradvine. Lots of referrals coming for you from a future Dartmouth alum \u{1F602}\u{1F602}, my younger brother will also be taking your services!", time: "2:12 PM" },
      { text: "Are bhai aap client bhi bhot shandar the, maja aaya \u{1F64F}", sent: true, time: "2:14 PM" },
    ],
  },
];

function WACard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="bg-surface px-5 py-4 flex items-center gap-3 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-base font-bold text-accent shrink-0">
          {t.avatar}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-heading leading-tight truncate">{t.name}</div>
          <div className="text-xs text-accent font-semibold mt-0.5">{t.school}</div>
        </div>
        <div className="ml-auto bg-accent/10 rounded-full px-3 py-1 text-xs font-semibold text-accent whitespace-nowrap">
          &#10003; Admitted
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5 bg-surface">
        {t.messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
              m.sent
                ? "bg-accent self-end text-right text-white"
                : "bg-card self-start text-heading border border-border"
            }`}
          >
            <span>{m.text}</span>
            <span className={`text-xs mt-1.5 block ${m.sent ? "text-right text-white/70" : "text-left text-muted"}`}>
              {m.time}
              {m.sent && <span className="text-white/80 ml-1">&#10003;&#10003;</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            }, i * 70);
          });
          io.unobserve(el);
        }
      },
      { threshold: 0.04 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-surface" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-12">
          <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">
            Real admits. Real reactions.
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading">
            The moment they <span className="text-accent">got in.</span>
          </h2>
          <p className="text-base text-body leading-relaxed max-w-2xl mt-4">
            These are real conversations from real students the moment their admit emails arrived. Unfiltered. Unedited.
          </p>
        </AnimatedSection>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-card
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
            >
              <WACard t={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
