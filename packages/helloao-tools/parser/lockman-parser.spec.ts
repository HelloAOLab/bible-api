import { LockmanParser } from './lockman-parser';
import { ParseTree, Chapter, Verse, Heading } from './types';

describe('LockmanParser', () => {
    let parser: LockmanParser;

    beforeEach(() => {
        parser = new LockmanParser();
    });

    it('should parse Genesis 1 and 2 from NASB', () => {
        const text = `<BN>GENESIS</BN>
<CN>CHAPTER 1</CN>
<SH>The Creation</SH>
<C>{{01::1}}1<T><RA><$R<RFN>01<RNC>1<RNV>1</RFN><RA>Ps 102:25; Is 40:21; John 1:1, 2; Heb 1:10$RE>In the beginning <RB><$R<RFN>01<RNC>1<RNV>1</RFN><RB>Ps 89:11; 90:2; Acts 17:24; Rom 1:20; Heb 11:3$RE>God <RC><$R<RFN>01<RNC>1<RNV>1</RFN><RC>Job 38:4; Is 42:5; 45:18; Rev 4:11$RE>created the heavens and the earth.
<V>{{01::1}}2<T>The earth was <FA><N1><$F<FN>01<FNC>1<FNV>2</FN><N1>Or {a waste and emptiness}$E><RA><$R<RFN>01<RNC>1<RNV>2</RFN><RA>Jer 4:23$RE>formless and void, and <RB><$R<RFN>01<RNC>1<RNV>2</RFN><RB>Job 38:9$RE>darkness was over the <N2><$F<FN>01<FNC>1<FNV>2</FN><N2>Lit {face of}$E>surface of the deep, and <RC><$R<RFN>01<RNC>1<RNV>2</RFN><RC>Ps 104:30; Is 40:13, 14$RE>the Spirit of God <RD><$R<RFN>01<RNC>1<RNV>2</RFN><RD>Deut 32:11; Is 31:5$RE>was <FA><N3><$F<FN>01<FNC>1<FNV>2</FN><N3>Or {hovering}$E>moving over the <N2><$F<FN>01<FNC>1<FNV>2</FN><N2>Lit {face of}$E>surface of the waters.
<V>{{01::1}}3<T>Then <RA><$R<RFN>01<RNC>1<RNV>3</RFN><RA>Ps 33:6, 9; 2 Cor 4:6$RE>God said, “Let there be light”; and there was light.
<V>{{01::1}}4<T>God saw that the light was <RA><$R<RFN>01<RNC>1<RNV>4</RFN><RA>Ps 145:9, 10$RE>good; and God <RB><$R<RFN>01<RNC>1<RNV>4</RFN><RB>Is 45:7$RE>separated the light from the darkness.
<V>{{01::1}}5<T><RA><$R<RFN>01<RNC>1<RNV>5</RFN><RA>Ps 74:16$RE>God called the light day, and the darkness He called night. And <RB><$R<RFN>01<RNC>1<RNV>5</RFN><RB>Ps 65:8$RE>there was evening and there was morning, one day.
<PM>{{01::1}}6<T>Then God said, “Let there be <N1><$F<FN>01<FNC>1<FNV>6</FN><N1>Or {a firmament}$E>an <RA><$R<RFN>01<RNC>1<RNV>6</RFN><RA>Is 40:22; Jer 10:12; 2 Pet 3:5$RE>expanse in the midst of the waters, and let it separate the waters from the waters.”
<V>{{01::1}}7<T>God made the <FA><N1><$F<FN>01<FNC>1<FNV>7</FN><N1>Or {firmament}$E>expanse, and separated <RA><$R<RFN>01<RNC>1<RNV>7</RFN><RA>Job 38:8-11$RE>the waters which were below the <N1><$F<FN>01<FNC>1<FNV>7</FN><N1>Or {firmament}$E>expanse from the waters <RB><$R<RFN>01<RNC>1<RNV>7</RFN><RB>Ps 148:4$RE>which were above the <N1><$F<FN>01<FNC>1<FNV>7</FN><N1>Or {firmament}$E>expanse; and it was so.
<V>{{01::1}}8<T>God called the <N1><$F<FN>01<FNC>1<FNV>8</FN><N1>Or {firmament}$E>expanse heaven. And there was evening and there was morning, a second day.
<PM>{{01::1}}9<T>Then God said, “<RA><$R<RFN>01<RNC>1<RNV>9</RFN><RA>Ps 104:6-9; Jer 5:22; 2 Pet 3:5$RE>Let the waters below the heavens be gathered into one place, and let <RB><$R<RFN>01<RNC>1<RNV>9</RFN><RB>Ps 24:1, 2; 95:5$RE>the dry land appear”; and it was so.
<V>{{01::1}}10<T>God called the dry land earth, and the <RA><$R<RFN>01<RNC>1<RNV>10</RFN><RA>Ps 33:7; 95:5; 146:6$RE>gathering of the waters He called seas; and God saw that it was good.
<V>{{01::1}}11<T>Then God said, “Let the earth sprout <N1><$F<FN>01<FNC>1<FNV>11</FN><N1>Or {grass}$E><RA><$R<RFN>01<RNC>1<RNV>11</RFN><RA>Ps 65:9-13; 104:14; Heb 6:7$RE>vegetation, <N2><$F<FN>01<FNC>1<FNV>11</FN><N2>Or {herbs}$E>plants yielding seed, {and} fruit trees on the earth bearing fruit after <N3><$F<FN>01<FNC>1<FNV>11</FN><N3>Lit {its}$E>their kind <N4><$F<FN>01<FNC>1<FNV>11</FN><N4>Lit {in which is its seed}$E>with seed in them”; and it was so.
<V>{{01::1}}12<T>The earth brought forth <N1><$F<FN>01<FNC>1<FNV>12</FN><N1>Or {grass}$E>vegetation, <N2><$F<FN>01<FNC>1<FNV>12</FN><N2>Or {herbs}$E>plants yielding seed after <N3><$F<FN>01<FNC>1<FNV>12</FN><N3>Lit {its}$E>their kind, and trees bearing fruit <N4><$F<FN>01<FNC>1<FNV>12</FN><N4>Lit {in which is its seed}$E>with seed in them, after <N3><$F<FN>01<FNC>1<FNV>12</FN><N3>Lit {its}$E>their kind; and God saw that it was good.
<V>{{01::1}}13<T>There was evening and there was morning, a third day.
<PM>{{01::1}}14<T>Then God said, “Let there be <N1><$F<FN>01<FNC>1<FNV>14</FN><N1>Or {luminaries, light-bearers}$E><RA><$R<RFN>01<RNC>1<RNV>14</RFN><RA>Ps 74:16; 136:7$RE>lights in the <N2><$F<FN>01<FNC>1<FNV>14</FN><N2>Or {firmament}$E><RB><$R<RFN>01<RNC>1<RNV>14</RFN><RB>Ps 19:1; 150:1$RE>expanse of the heavens to separate the day from the night, and let them be for <RC><$R<RFN>01<RNC>1<RNV>14</RFN><RC>Jer 10:2$RE>signs and for <RD><$R<RFN>01<RNC>1<RNV>14</RFN><RD>Ps 104:19$RE>seasons and for days and years;
<V>{{01::1}}15<T>and let them be for <N1><$F<FN>01<FNC>1<FNV>15</FN><N1>Or {luminaries, light-bearers}$E>lights in the <N2><$F<FN>01<FNC>1<FNV>15</FN><N2>Or {firmament}$E>expanse of the heavens to give light on the earth”; and it was so.
<V>{{01::1}}16<T>God made the two <N1><$F<FN>01<FNC>1<FNV>16</FN><N1>Or {luminaries, light-bearers}$E>great lights, the <RA><$R<RFN>01<RNC>1<RNV>16</RFN><RA>Ps 136:8, 9$RE>greater <N2><$F<FN>01<FNC>1<FNV>16</FN><N2>Or {luminary, light-bearer}$E>light <N3><$F<FN>01<FNC>1<FNV>16</FN><N3>Lit {for the dominion of}$E>to govern the day, and the lesser <N2><$F<FN>01<FNC>1<FNV>16</FN><N2>Or {luminary, light-bearer}$E>light <N3><$F<FN>01<FNC>1<FNV>16</FN><N3>Lit {for the dominion of}$E>to govern the night; {He made} <RB><$R<RFN>01<RNC>1<RNV>16</RFN><RB>Job 38:7; Ps 8:3; Is 40:26$RE>the stars also.
<V>{{01::1}}17<T><RA><$R<RFN>01<RNC>1<RNV>17</RFN><RA>Jer 33:20, 25$RE>God placed them in the <N1><$F<FN>01<FNC>1<FNV>17</FN><N1>Or {firmament}$E>expanse of the heavens to give light on the earth,
<V>{{01::1}}18<T>and <N1><$F<FN>01<FNC>1<FNV>18</FN><N1>Lit {for the dominion of}$E>to <RA><$R<RFN>01<RNC>1<RNV>18</RFN><RA>Jer 31:35$RE>govern the day and the night, and to separate the light from the darkness; and God saw that it was good.
<V>{{01::1}}19<T>There was evening and there was morning, a fourth day.
<PM>{{01::1}}20<T>Then God said, “Let the waters <N1><$F<FN>01<FNC>1<FNV>20</FN><N1>Or {swarm}$E>teem with swarms of living creatures, and let birds fly above the earth <N2><$F<FN>01<FNC>1<FNV>20</FN><N2>Lit {on the face of}$E>in the open <N3><$F<FN>01<FNC>1<FNV>20</FN><N3>Or {firmament}$E>expanse of the heavens.”
<V>{{01::1}}21<T>God created <RA><$R<RFN>01<RNC>1<RNV>21</RFN><RA>Ps 104:25-28$RE>the great sea monsters and every living creature that moves, with which the waters swarmed after their kind, and every winged bird after its kind; and God saw that it was good.
<V>{{01::1}}22<T>God blessed them, saying, “Be fruitful and multiply, and fill the waters in the seas, and let birds multiply on the earth.”
<V>{{01::1}}23<T>There was evening and there was morning, a fifth day.
<PM>{{01::1}}24<T><RA><$R<RFN>01<RNC>1<RNV>24</RFN><RA>Gen 2:19; 6:20; 7:14; 8:19$RE>Then God said, “Let the earth bring forth living creatures after <N1><$F<FN>01<FNC>1<FNV>24</FN><N1>Lit {its}$E>their kind: cattle and creeping things and beasts of the earth after <N1><$F<FN>01<FNC>1<FNV>24</FN><N1>Lit {its}$E>their kind”; and it was so.
<V>{{01::1}}25<T>God made the <RA><$R<RFN>01<RNC>1<RNV>25</RFN><RA>Gen 7:21, 22; Jer 27:5$RE>beasts of the earth after <N1><$F<FN>01<FNC>1<FNV>25</FN><N1>Lit {its}$E>their kind, and the cattle after <N1><$F<FN>01<FNC>1<FNV>25</FN><N1>Lit {its}$E>their kind, and everything that creeps on the ground after its kind; and God saw that it was good.
<PM>{{01::1}}26<T>Then God said, “Let <RA><$R<RFN>01<RNC>1<RNV>26</RFN><RA>Gen 3:22; 11:7$RE>Us make <RB><$R<RFN>01<RNC>1<RNV>26</RFN><RB>Gen 5:1; 9:6; 1 Cor 11:7; Eph 4:24; James 3:9$RE>man in Our image, according to Our likeness; and let them <RC><$R<RFN>01<RNC>1<RNV>26</RFN><RC>Ps 8:6-8$RE>rule over the fish of the sea and over the birds of the <N1><$F<FN>01<FNC>1<FNV>26</FN><N1>Lit {heavens}$E>sky and over the cattle and over all the earth, and over every creeping thing that creeps on the earth.”
<V>{{01::1}}27<T>God created man <RA><$R<RFN>01<RNC>1<RNV>27</RFN><RA>Gen 5:1f; 1 Cor 11:7; Eph 4:24; Col 3:10$RE>in His own image, in the image of God He created him; <RB><$R<RFN>01<RNC>1<RNV>27</RFN><RB>Matt 19:4; Mark 10:6$RE>male and female He created them.
<V>{{01::1}}28<T>God blessed them; and God said to them, “<RA><$R<RFN>01<RNC>1<RNV>28</RFN><RA>Gen 9:1, 7; Lev 26:9; Ps 127:3, 5$RE>Be fruitful and multiply, and fill the earth, and subdue it; and rule over the fish of the sea and over the birds of the <N1><$F<FN>01<FNC>1<FNV>28</FN><N1>Lit {heavens}$E>sky and over every living thing that <N2><$F<FN>01<FNC>1<FNV>28</FN><N2>Or {creeps}$E>moves on the earth.”
<V>{{01::1}}29<T>Then God said, “Behold, <RA><$R<RFN>01<RNC>1<RNV>29</RFN><RA>Ps 104:14; 136:25$RE>I have given you every plant yielding seed that is on the <N1><$F<FN>01<FNC>1<FNV>29</FN><N1>Lit {face of}$E>surface of all the earth, and every tree <N2><$F<FN>01<FNC>1<FNV>29</FN><N2>Lit {in which is the fruit of a tree yielding seed}$E>which has fruit yielding seed; it shall be food for you;
<V>{{01::1}}30<T>and <RA><$R<RFN>01<RNC>1<RNV>30</RFN><RA>Ps 145:15, 16; 147:9$RE>to every beast of the earth and to every bird of the <N1><$F<FN>01<FNC>1<FNV>30</FN><N1>Lit {heavens}$E>sky and to every thing that <N2><$F<FN>01<FNC>1<FNV>30</FN><N2>Or {creeps}$E>moves on the earth <N3><$F<FN>01<FNC>1<FNV>30</FN><N3>Lit {in which is a living soul}$E>which has life, {I have given} every green plant for food”; and it was so.
<V>{{01::1}}31<T>God saw all that He had made, and behold, it was very <RA><$R<RFN>01<RNC>1<RNV>31</RFN><RA>Ps 104:24, 28; 119:68; 1 Tim 4:4$RE>good. And there was evening and there was morning, the sixth day.
<CN>CHAPTER 2</CN>
<SH>The Creation of Man and Woman</SH>
<C>{{01::2}}1<T>Thus the heavens and the earth were completed, and all <RA><$R<RFN>01<RNC>2<RNV>1</RFN><RA>Deut 4:19; 17:3$RE>their hosts.
<V>{{01::2}}2<T>By <RA><$R<RFN>01<RNC>2<RNV>2</RFN><RA>Ex 20:8-11; 31:17$RE>the seventh day God completed His work which He had done, and <RB><$R<RFN>01<RNC>2<RNV>2</RFN><RB>Heb 4:4, 10$RE>He rested on the seventh day from all His work which He had done.
<V>{{01::2}}3<T>Then God blessed the seventh day and sanctified it, because in it He rested from all His work which God had created <N1><$F<FN>01<FNC>2<FNV>3</FN><N1>Lit {to make}$E>and made.
<PM>{{01::2}}4<T><N1><$F<FN>01<FNC>2<FNV>4</FN><N1>Lit {These are the generations}$E><RA><$R<RFN>01<RNC>2<RNV>4</RFN><RA>Job 38:4-11$RE>This is the account of the heavens and the earth when they were created, in <RB><$R<RFN>01<RNC>2<RNV>4</RFN><RB>Gen 1:3-31$RE>the day that the L<\>ORD</> God made earth and heaven.
<V>{{01::2}}5<T><RA><$R<RFN>01<RNC>2<RNV>5</RFN><RA>Gen 1:11$RE>Now no shrub of the field was yet in the earth, and no plant of the field had yet sprouted, <RB><$R<RFN>01<RNC>2<RNV>5</RFN><RB>Ps 65:9, 10; Jer 10:12, 13$RE>for the L<\>ORD</> God had not sent rain upon the earth, and there was no man to <N1><$F<FN>01<FNC>2<FNV>5</FN><N1>Lit {work, serve}$E>cultivate the ground.
<V>{{01::2}}6<T>But a <N1><$F<FN>01<FNC>2<FNV>6</FN><N1>Or {flow}$E>mist used to rise from the earth and water the whole <N2><$F<FN>01<FNC>2<FNV>6</FN><N2>Lit {face of}$E>surface of the ground.
<V>{{01::2}}7<T>Then the L<\>ORD</> God formed man of <RA><$R<RFN>01<RNC>2<RNV>7</RFN><RA>Gen 3:19$RE>dust from the ground, and breathed into his nostrils the breath of life; and <RB><$R<RFN>01<RNC>2<RNV>7</RFN><RB>1 Cor 15:45$RE>man became a living <N1><$F<FN>01<FNC>2<FNV>7</FN><N1>Lit {soul}$E>being.
<V>{{01::2}}8<T>The L<\>ORD</> God planted a <RA><$R<RFN>01<RNC>2<RNV>8</RFN><RA>Gen 13:10; Is 51:3; Ezek 28:13$RE>garden toward the east, in Eden; and there He placed the man whom He had formed.
<V>{{01::2}}9<T>Out of the ground the L<\>ORD</> God caused to grow <RA><$R<RFN>01<RNC>2<RNV>9</RFN><RA>Ezek 47:12$RE>every tree that is pleasing to the sight and good for food; <RB><$R<RFN>01<RNC>2<RNV>9</RFN><RB>Gen 3:22; Rev 2:7; 22:2, 14$RE>the tree of life also in the midst of the garden, and the tree of the knowledge of good and evil.
<PM>{{01::2}}10<T>Now a <RA><$R<RFN>01<RNC>2<RNV>10</RFN><RA>Ps 46:4$RE>river <N1><$F<FN>01<FNC>2<FNV>10</FN><N1>Lit {was going out}$E>flowed out of Eden to water the garden; and from there it divided and became four <N2><$F<FN>01<FNC>2<FNV>10</FN><N2>Lit {heads}$E>rivers.
<V>{{01::2}}11<T>The name of the first is Pishon; it <N1><$F<FN>01<FNC>2<FNV>11</FN><N1>Lit {surrounds}$E>flows around the whole land of <RA><$R<RFN>01<RNC>2<RNV>11</RFN><RA>Gen 25:18$RE>Havilah, where there is gold.
<V>{{01::2}}12<T>The gold of that land is good; the bdellium and the onyx stone are there.
<V>{{01::2}}13<T>The name of the second river is Gihon; it <N1><$F<FN>01<FNC>2<FNV>13</FN><N1>Lit {is the one surrounding}$E>flows around the whole land of Cush.
<V>{{01::2}}14<T>The name of the third river is <N1><$F<FN>01<FNC>2<FNV>14</FN><N1>Heb {Hiddekel}$E><RA><$R<RFN>01<RNC>2<RNV>14</RFN><RA>Dan 10:4$RE>Tigris; it <N2><$F<FN>01<FNC>2<FNV>14</FN><N2>Lit {is the one going}$E>flows east of Assyria. And the fourth river is the <N3><$F<FN>01<FNC>2<FNV>14</FN><N3>Heb {Perath}$E><RB><$R<RFN>01<RNC>2<RNV>14</RFN><RB>Gen 15:18$RE>Euphrates.
<PM>{{01::2}}15<T>Then the L<\>ORD</> God took the man and put him into the garden of Eden to cultivate it and keep it.
<V>{{01::2}}16<T>The L<\>ORD</> God <RA><$R<RFN>01<RNC>2<RNV>16</RFN><RA>Gen 3:2, 3$RE>commanded the man, saying, “From any tree of the garden you may eat freely;
<V>{{01::2}}17<T>but from the tree of the knowledge of good and evil you shall not <N1><$F<FN>01<FNC>2<FNV>17</FN><N1>Lit {eat from it}$E>eat, for in the day that you eat from it <RA><$R<RFN>01<RNC>2<RNV>17</RFN><RA>Deut 30:15, 19, 20; Rom 6:23; 1 Tim 5:6; James 1:15$RE>you will surely die.”
<PM>{{01::2}}18<T>Then the L<\>ORD</> God said, “It is not good for the man to be alone; <RA><$R<RFN>01<RNC>2<RNV>18</RFN><RA>1 Cor 11:9$RE>I will make him a helper <FA><N1><$F<FN>01<FNC>2<FNV>18</FN><N1>Lit {corresponding to}$E>suitable for him.”
<V>{{01::2}}19<T><RA><$R<RFN>01<RNC>2<RNV>19</RFN><RA>Gen 1:24$RE>Out of the ground the L<\>ORD</> God formed every beast of the field and every bird of the <N1><$F<FN>01<FNC>2<FNV>19</FN><N1>Lit {heavens}$E>sky, and <RB><$R<RFN>01<RNC>2<RNV>19</RFN><RB>Gen 1:26$RE>brought {them} to the man to see what he would call them; and whatever the man called a living creature, that was its name.
<V>{{01::2}}20<T>The man gave names to all the cattle, and to the birds of the <N1><$F<FN>01<FNC>2<FNV>20</FN><N1>Lit {heavens}$E>sky, and to every beast of the field, but for <FA><N2><$F<FN>01<FNC>2<FNV>20</FN><N2>Or {man}$E>Adam there was not found <RA><$R<RFN>01<RNC>2<RNV>20</RFN><RA>Gen 2:18$RE>a helper <N3><$F<FN>01<FNC>2<FNV>20</FN><N3>Lit {corresponding to}$E>suitable for him.
<V>{{01::2}}21<T>So the L<\>ORD</> God caused a <RA><$R<RFN>01<RNC>2<RNV>21</RFN><RA>Gen 15:12$RE>deep sleep to fall upon the man, and he slept; then He took one of his ribs and closed up the flesh at that place.
<V>{{01::2}}22<T>The L<\>ORD</> God <FA><N1><$F<FN>01<FNC>2<FNV>22</FN><N1>Lit {built}$E>fashioned into a woman <RA><$R<RFN>01<RNC>2<RNV>22</RFN><RA>1 Cor 11:8, 9$RE>the rib which He had taken from the man, and brought her to the man.
<V>{{01::2}}23<T>The man said, <PO>“<RA><$R<RFN>01<RNC>2<RNV>23</RFN><RA>Gen 29:14; Eph 5:28, 29$RE>This is now bone of my bones, <PO>And flesh of my flesh; <PO><N1><$F<FN>01<FNC>2<FNV>23</FN><N1>Lit {This one}$E>She shall be called <N2><$F<FN>01<FNC>2<FNV>23</FN><N2>Heb {Ishshah}$E>Woman, <PO>Because <N1><$F<FN>01<FNC>2<FNV>23</FN><N1>Lit {This one}$E>she was taken out of <N3><$F<FN>01<FNC>2<FNV>23</FN><N3>Heb {Ish}$E>Man.”
<A>{{01::2}}24<T><RA><$R<RFN>01<RNC>2<RNV>24</RFN><RA>Matt 19:5; Mark 10:7, 8; 1 Cor 6:16; Eph 5:31$RE>For this reason a man shall leave his father and his mother, and be joined to his wife; and they shall become one flesh.
<V>{{01::2}}25<T><RA><$R<RFN>01<RNC>2<RNV>25</RFN><RA>Gen 3:7, 10, 11$RE>And the man and his wife were both naked and were not ashamed.
`;

        const results = parser.parse(text);

        expect(results).toMatchSnapshot();

        // Expect 1 book for this test
        expect(results.length).toBe(1);
        const result = results[0];

        expect(result.type).toBe('root');
        expect(result.title).toBe('GENESIS');
        expect(result.content.length).toBe(2);

        // Check Chapter 1
        const chapter1 = result.content[0];
        if (chapter1.type === 'heading') {
            // This branch should not be taken in this specific test set up assuming the parser structure returns chapters as content of root
            // But based on types.ts 'content' of root is (Heading | Chapter)[]
            // 'GENESIS' is title, so first item should be chapter 1 or maybe a heading?
            // The input has <BN>GENESIS</BN> which maps to title.
            // <CN>CHAPTER 1</CN> starts chapter 1.
        } else if (chapter1.type === 'chapter') {
            expect(chapter1.number).toBe(1);
            expect(chapter1.content.length).toBeGreaterThan(0);

            // Check headers
            const header = chapter1.content.find((c) => c.type === 'heading');
            expect(header).toBeDefined();
            if (header && header.type === 'heading') {
                expect(header.content).toContain('The Creation');
            }

            // Check verses
            const verses = chapter1.content.filter((c) => c.type === 'verse');
            expect(verses.length).toBe(31);

            // Spot check verse 1
            const verse1 = verses[0];
            if (verse1.type === 'verse') {
                expect(verse1.number).toBe(1);
                const textContent = verse1.content
                    .map((c) =>
                        typeof c === 'string' ? c : (c as any).text || ''
                    )
                    .join('');
                expect(textContent).toContain('In the beginning');
                expect(textContent).toContain('God');
                expect(textContent).toContain(
                    'created the heavens and the earth.'
                );
            }
        }

        // Check Chapter 2
        const chapter2 = result.content[1];
        if (chapter2.type === 'chapter') {
            expect(chapter2.number).toBe(2);

            // Check verses
            const verses = chapter2.content.filter((c) => c.type === 'verse');
            expect(verses.length).toBe(25);
        }
    });

    it('should parse multiple books (Genesis and Exodus)', () => {
        const text = `<BN>GENESIS</BN>
<CN>CHAPTER 1</CN>
<V>{{01::1}}1<T>In the beginning...
<BN>EXODUS</BN>
<CN>CHAPTER 1</CN>
<V>{{02::1}}1<T>Now these are the names...`;

        const roots = parser.parse(text);

        // Full structure validation for the multiple books test
        expect(roots).toEqual([
            {
                type: 'root',
                title: 'GENESIS',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        footnotes: [],
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: ['In the beginning...'],
                            },
                        ],
                    },
                ],
            },
            {
                type: 'root',
                title: 'EXODUS',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        footnotes: [],
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: ['Now these are the names...'],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should parse paragraph breaks', () => {
        // <PM> implies a paragraph start for that verse
        const text = `<BN>GENESIS</BN>
<CN>CHAPTER 1</CN>
<V>{{01::1}}1<T>Verse 1
<PM>{{01::1}}2<T>Verse 2
<V>{{01::1}}3<T>Verse 3`;

        const roots = parser.parse(text);

        expect(roots).toEqual([
            {
                type: 'root',
                title: 'GENESIS',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        footnotes: [],
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: ['Verse 1'],
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: ['Verse 2'],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: ['Verse 3'],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should parse italics', () => {
        // {} implies italics
        const text = `<BN>GENESIS</BN>
<CN>CHAPTER 1</CN>
<V>{{01::1}}1<T>In the {beginning} God.`;

        const roots = parser.parse(text);

        expect(roots).toEqual([
            {
                type: 'root',
                title: 'GENESIS',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        footnotes: [],
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the ',
                                    {
                                        text: 'beginning',
                                        italics: true,
                                    },
                                    ' God.',
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should parse footnotes', () => {
        const text = `<BN>GENESIS</BN>
<CN>CHAPTER 1</CN>
<V>{{01::1}}1<T>The earth <FA><N1><$F<FN>01<FNC>1<FNV>1</FN><N1>Or {a waste}$E>was formless.`;

        const roots = parser.parse(text);

        expect(roots).toEqual([
            {
                type: 'root',
                title: 'GENESIS',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        footnotes: [
                            {
                                noteId: 1,
                                text: 'Or a waste',
                                caller: '+',
                                reference: {
                                    chapter: 1,
                                    verse: 1,
                                },
                            },
                        ],
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'The earth ',
                                    { noteId: 1 },
                                    'was formless.',
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should remove italics curly braces from footnotes', () => {
        // Use realistic footnote structure: <$F <FN>metadata</FN> Content $E>
        const text = `<BN>GENESIS</BN> <CN>1</CN> <V>{{01::1}}1<T>Verse text.<$F<FN>01</FN>Footnote {with} braces.$E>`;
        const roots = parser.parse(text);

        const chapter = roots[0].content[0] as Chapter;

        expect(chapter.footnotes.length).toBe(1);
        expect(chapter.footnotes[0].text).toBe('Footnote with braces.');
    });

    it('should remove $START and END$ markers ', () => {
        const text = `$START abc def END$<BN>GENESIS</BN> <CN>1</CN> <V>{{01::1}}1<T>Verse text.`;

        const roots = parser.parse(text);

        expect(roots).toEqual([
            {
                type: 'root',
                title: 'GENESIS',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        footnotes: [],
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: ['Verse text.'],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should parse Psalm 16 with poem markers', () => {
        const text = `<BN>PSALMS</BN>
<SN>PSALM 16</SN>
<SH>The L<\>{ORD}</> the Psalmist’s Portion in Life and Deliverer in Death.</SH>
<SS>A <FA><NA><$F<FN>19<FNC>PSALM 16<FNV>Title</FN><NA>Possibly {Epigrammatic Poem} or {Atonement Psalm}$E>Mikhtam of David.</SS>
<CP>{{19::16}}1<T><PN><RA><$R<RFN>19<RNC>16<RNV>1</RFN><RA>Ps 17:8$RE>Preserve me, O God, for <RB><$R<RFN>19<RNC>16<RNV>1</RFN><RB>Ps 7:1$RE>I take refuge in You.
<P>{{19::16}}2<T><PN><N1><$F<FN>19<FNC>16<FNV>2</FN><N1>Or O my soul, {you said}$E>I said to the L<\>ORD</>, “You are <N2><$F<FN>19<FNC>16<FNV>2</FN><N2>Or {the Lord}$E>my Lord; <PO>I <RA><$R<RFN>19<RNC>16<RNV>2</RFN><RA>Ps 73:25$RE>have no good besides You.”
<P>{{19::16}}3<T><PN>As for the <N1><$F<FN>19<FNC>16<FNV>3</FN><N1>Lit {holy ones;} i.e. the godly$E><RA><$R<RFN>19<RNC>16<RNV>3</RFN><RA>Ps 101:6$RE>saints who are in the earth, <PO><N2><$F<FN>19<FNC>16<FNV>3</FN><N2>Lit {And the majestic ones...delight}$E>They are the majestic ones <RB><$R<RFN>19<RNC>16<RNV>3</RFN><RB>Ps 119:63$RE>in whom is all my delight.`;

        const roots = parser.parse(text);

        expect(roots).toMatchSnapshot();
    });

    it('should parse red lettering as wordsOfJesus', () => {
        const text = `<CN>CHAPTER 13</CN>
<SH>Call to Repent</SH>
<C>{{42::13}}1<T>Now on the same occasion there were some present who reported to Him about the Galileans whose blood <RA><$R<RFN>42<RNC>13<RNV>1</RFN><RA>Matt 27$RE>Pilate had <N1><$F<FN>42<FNC>13<FNV>1</FN><N1>I.e. shed along with$E>mixed with their sacrifices.
<V>{{42::13}}2<T>And Jesus said to them, <RS>“<RA><$R<RFN>42<RNC>13<RNV>2</RFN><RA>John 9:2f$RE>Do you suppose that these Galileans were {greater} sinners than all {other} Galileans because they suffered this {fate?}</RS>
<V>{{42::13}}3<T><RS>+“I tell you, no, but unless you <N1><$F<FN>42<FNC>13<FNV>3</FN><N1>Or {are repentant}$E>repent, you will all likewise perish.</RS>
<V>{{42::13}}4<T><RS>+“Or do you suppose that those eighteen on whom the tower in <RA><$R<RFN>42<RNC>13<RNV>4</RFN><RA>Neh 3:15; Is 8:6; John 9:7, 11$RE>Siloam fell and killed them were {worse} <N1><$F<FN>42<FNC>13<FNV>4</FN><N1>Lit {debtors}$E><RB><$R<RFN>42<RNC>13<RNV>4</RFN><RB>Matt 6:12; Luke 11:4$RE>culprits than all the men who live in Jerusalem?</RS>
<V>{{42::13}}5<T><RS>+“I tell you, no, but unless you repent, you will all likewise perish.”</RS>
<PM>{{42::13}}6<T>And He {began} telling this parable: <RS>“A man had <RA><$R<RFN>42<RNC>13<RNV>6</RFN><RA>Matt 21:19$RE>a fig tree which had been planted in his vineyard; and he came looking for fruit on it and did not find any.</RS>
<V>{{42::13}}7<T><RS>+“And he said to the vineyard-keeper, ‘Behold, for three years I have come looking for fruit on this fig tree <N1><$F<FN>42<FNC>13<FNV>7</FN><N1>Lit {and I do not find}$E>without finding any. <RA><$R<RFN>42<RNC>13<RNV>7</RFN><RA>Matt 3:10; 7:19; Luke 3:9$RE>Cut it down! Why does it even use up the ground?’</RS>
<V>{{42::13}}8<T><RS>+“And he answered and said to him, ‘Let it alone, sir, for this year too, until I dig around it and put in fertilizer;</RS>
<V>{{42::13}}9<T><RS>and if it bears fruit next year, {fine;} but if not, cut it down.’”</RS>`;

        const roots = parser.parse(text);

        expect(roots).toMatchSnapshot();
    });

    it('should parse red lettering but be able to end a verse without red lettering', () => {
        const text = `<CN>CHAPTER 17</CN>
<V>{{42::17}}14<T>When He saw them, He said to them, <RS>“<RA><$R<RFN>42<RNC>17<RNV>14</RFN><RA>Lev 14:1-32; Matt 8:4; Luke 5:14$RE>Go and show yourselves to the priests.”</RS> And as they were going, they were cleansed.`;

        const roots = parser.parse(text);

        expect(roots).toEqual([
            {
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 17,
                        content: [
                            {
                                type: 'verse',
                                number: 14,
                                content: [
                                    'When He saw them, He said to them, ',
                                    {
                                        text: '“Go and show yourselves to the priests.”',
                                        wordsOfJesus: true,
                                    },
                                    ' And as they were going, they were cleansed.',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            },
        ]);
    });

    it('should join quotes which are continuations of each other', () => {
        const text = `<CN>CHAPTER 13</CN>
<SH>Call to Repent</SH>
<C>{{42::13}}1<T>Now on the same occasion there were some present who reported to Him about the Galileans whose blood <RA><$R<RFN>42<RNC>13<RNV>1</RFN><RA>Matt 27$RE>Pilate had <N1><$F<FN>42<FNC>13<FNV>1</FN><N1>I.e. shed along with$E>mixed with their sacrifices.
<V>{{42::13}}2<T>And Jesus said to them, <RS>“<RA><$R<RFN>42<RNC>13<RNV>2</RFN><RA>John 9:2f$RE>Do you suppose that these Galileans were {greater} sinners than all {other} Galileans because they suffered this {fate?}</RS>
<V>{{42::13}}3<T><RS>+“I tell you, no, but unless you <N1><$F<FN>42<FNC>13<FNV>3</FN><N1>Or {are repentant}$E>repent, you will all likewise perish.</RS>
<V>{{42::13}}4<T><RS>+“Or do you suppose that those eighteen on whom the tower in <RA><$R<RFN>42<RNC>13<RNV>4</RFN><RA>Neh 3:15; Is 8:6; John 9:7, 11$RE>Siloam fell and killed them were {worse} <N1><$F<FN>42<FNC>13<FNV>4</FN><N1>Lit {debtors}$E><RB><$R<RFN>42<RNC>13<RNV>4</RFN><RB>Matt 6:12; Luke 11:4$RE>culprits than all the men who live in Jerusalem?</RS>
<V>{{42::13}}5<T><RS>+“I tell you, no, but unless you repent, you will all likewise perish.”</RS>`;

        const roots = parser.parse(text);

        expect(roots).toEqual([
            {
                content: [
                    {
                        content: [
                            {
                                content: ['Call to Repent'],
                                type: 'heading',
                            },
                            {
                                content: [
                                    'Now on the same occasion there were some present who reported to Him about the Galileans whose blood Pilate had ',
                                    {
                                        noteId: 1,
                                    },
                                    'mixed with their sacrifices.',
                                ],
                                number: 1,
                                type: 'verse',
                            },
                            {
                                content: [
                                    'And Jesus said to them, ',
                                    {
                                        text: '“Do you suppose that these Galileans were ',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        italics: true,
                                        text: 'greater',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        text: ' sinners than all ',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        italics: true,
                                        text: 'other',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        text: ' Galileans because they suffered this ',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        italics: true,
                                        text: 'fate?',
                                        wordsOfJesus: true,
                                    },
                                ],
                                number: 2,
                                type: 'verse',
                            },
                            {
                                content: [
                                    {
                                        text: 'I tell you, no, but unless you ',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        noteId: 2,
                                    },
                                    {
                                        text: 'repent, you will all likewise perish.',
                                        wordsOfJesus: true,
                                    },
                                ],
                                number: 3,
                                type: 'verse',
                            },
                            {
                                content: [
                                    {
                                        text: 'Or do you suppose that those eighteen on whom the tower in Siloam fell and killed them were ',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        italics: true,
                                        text: 'worse',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        text: ' ',
                                        wordsOfJesus: true,
                                    },
                                    {
                                        noteId: 3,
                                    },
                                    {
                                        text: 'culprits than all the men who live in Jerusalem?',
                                        wordsOfJesus: true,
                                    },
                                ],
                                number: 4,
                                type: 'verse',
                            },
                            {
                                content: [
                                    {
                                        text: 'I tell you, no, but unless you repent, you will all likewise perish.”',
                                        wordsOfJesus: true,
                                    },
                                ],
                                number: 5,
                                type: 'verse',
                            },
                        ],
                        footnotes: [
                            {
                                caller: '+',
                                noteId: 1,
                                reference: {
                                    chapter: 13,
                                    verse: 1,
                                },
                                text: 'I.e. shed along with',
                            },
                            {
                                caller: '+',
                                noteId: 2,
                                reference: {
                                    chapter: 13,
                                    verse: 3,
                                },
                                text: 'Or are repentant',
                            },
                            {
                                caller: '+',
                                noteId: 3,
                                reference: {
                                    chapter: 13,
                                    verse: 4,
                                },
                                text: 'Lit debtors',
                            },
                        ],
                        number: 13,
                        type: 'chapter',
                    },
                ],
                type: 'root',
            },
        ]);
    });
});
