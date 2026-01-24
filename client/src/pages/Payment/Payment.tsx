import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import Input from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export function Payment() {
  return (
    <div>
      <div className="flex justify-start gap-3 mb-20">
        <Link to="/">
          <p className="font-extrabold">T-buddy</p>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md text-left ">
          <Card className="p-5">
            <form>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Payment Method</FieldLegend>
                  <FieldDescription>
                    All transactions are secure and encrypted
                  </FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                        Name on Card
                      </FieldLabel>
                      <Input
                        id="checkout-7j9-card-name-43j"
                        placeholder="Evil Rabbit"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                        Card Number
                      </FieldLabel>
                      <Input
                        id="checkout-7j9-card-number-uw1"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                      <FieldDescription>
                        Enter your 16-digit card number
                      </FieldDescription>
                    </Field>
                    <div className="grid grid-cols-3 gap-4">
                      <Field>
                        <FieldLabel htmlFor="checkout-exp-month-ts6">
                          Month
                        </FieldLabel>
                        <Select defaultValue="">
                          <SelectTrigger id="checkout-exp-month-ts6">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="01">01</SelectItem>
                              <SelectItem value="02">02</SelectItem>
                              <SelectItem value="03">03</SelectItem>
                              <SelectItem value="04">04</SelectItem>
                              <SelectItem value="05">05</SelectItem>
                              <SelectItem value="06">06</SelectItem>
                              <SelectItem value="07">07</SelectItem>
                              <SelectItem value="08">08</SelectItem>
                              <SelectItem value="09">09</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="11">11</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                          Year
                        </FieldLabel>
                        <Select defaultValue="">
                          <SelectTrigger id="checkout-7j9-exp-year-f59">
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="2024">2024</SelectItem>
                              <SelectItem value="2025">2025</SelectItem>
                              <SelectItem value="2026">2026</SelectItem>
                              <SelectItem value="2027">2027</SelectItem>
                              <SelectItem value="2028">2028</SelectItem>
                              <SelectItem value="2029">2029</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                        <Input
                          id="checkout-7j9-cvv"
                          placeholder="123"
                          required
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <Field orientation="horizontal">
                  <Button asChild type="submit">
                    <Link to="/home">Subscribe</Link>
                  </Button>
                  <Button variant="outline" asChild type="button">
                    <Link to="/signup">Cancel</Link>
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
