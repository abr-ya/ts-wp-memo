export interface IComponent {
  render: () => string;
  afterRender?: () => void;
}

export const HomeComponent: IComponent = {
  render: () => `
    <section>
      <h2>Home</h2>
      <p>This is just a test</p>
    </section>
  `,
};

export const Page1Component: IComponent = {
  render: () => `
    <section>
      <h2>Page 1</h2>
      <p>This is just a test</p>
    </section>
  `,
};

export const Page2Component: IComponent = {
  render: () => `
    <section>
      <h2>Page 2</h2>
      <p>This is just a test!!!!</p>
    </section>
  `,
};

export const ErrorComponent: IComponent = {
  render: () => `
    <section>
      <h2>Error</h2>
      <p>This is just a test</p>
    </section>
  `,
};
