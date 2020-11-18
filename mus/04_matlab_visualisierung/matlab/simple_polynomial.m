close all; clear

%%
x = linspace(-5, 5, 1000);
y = @(x) 1/2*x.^3 - x.^2 - 2*x + 1;

%%
figure(1), clf
plot(x, y(x))
saveas(gcf, fullfile('..', 'simple_polynomial_1.svg'))

%%
axis([-4 4 -5 5])
saveas(gcf, fullfile('..', 'simple_polynomial_2.svg'))

%%
grid on
saveas(gcf, fullfile('..', 'simple_polynomial_3.svg'))

%%
xlabel('x\rightarrow')
ylabel('f(x)\rightarrow')
saveas(gcf, fullfile('..', 'simple_polynomial_4.svg'))

%%
x0 = roots([3/2, -2, -2]);
x_limits = xlim();
y_limits = ylim();
hold on
plot([x0(1), x0(1)], [y_limits(1), y(x0(1))], 'k--')
plot([x0(2), x0(2)], [y_limits(1), y(x0(2))], 'k--')
plot([x_limits(1), x0(1)], [y(x0(1)), y(x0(1))], 'k--')
plot([x_limits(1), x0(2)], [y(x0(2)), y(x0(2))], 'k--')
plot(x0(1), y(x0(1)), 'ko')
plot(x0(2), y(x0(2)), 'ko')
saveas(gcf, fullfile('..', 'simple_polynomial_5.svg'))
