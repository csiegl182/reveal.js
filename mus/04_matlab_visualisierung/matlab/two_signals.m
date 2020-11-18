%%
t = linspace(0, 100e-3, 200);
y1 = cos(2*pi*50*t);
y2 = (sin(2*pi*50*t) + 1/3*sin(2*pi*150*t) + 1/5*sin(2*pi*250*t)) + 3/2;

%%
figure(1), clf
h = plot(t, y1, '--');
set(h, 'LineWidth', 3)
set(h, 'Color', [0, 0.5, 1])
hold on
plot(t, y2, 'LineWidth', 2)
ylim([-2, 4])
set(gcf, 'Position', [220, 920, 1000, 400])
grid on
h = title('Zwei Signale');
set(h, 'FontSize', 20)
xlabel('t \rightarrow')
ylabel('y_{1,2}(t) \rightarrow')
set(gca, 'YTick', -2:4)
legend('Sinus', 'Rechteck', 'Location', 'SW')
h = text(0.03, -0.5, 'y_1(t) = sin(2\pi f t)');
set(h, 'FontSize', 15)
set(h, 'BackgroundColor', 'w')
set(h, 'EdgeColor', [0, 0.5, 1])
text(0.02, 3, '$y_2(t) = \frac{4}{\pi}\sum\limits_{k=1}^3\frac{\sin(2(2k-1)\pi f t)}{2k-1} + \frac{3}{2}$', ...
    'Interpreter', 'Latex', ...
    'FontSize', 20)
saveas(gcf, 'two_signals.png')